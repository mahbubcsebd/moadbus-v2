import { changeAccountOrder, getUpdatedAccounts } from '@/api/endpoints';
import { generatedRoi } from '@/globals/appGlobals';
import { useAccountsStore } from '@/store/accountsStore';
import {
  detectAccountColor,
  detectAccountType,
  getAvaiableFunctions,
} from '@/utils/formatAccounts';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { ChevronRight, Grid3x3, LayoutGrid, List } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import AccountCard from './AccountCard';
import AccountTab from './AccountTab';

// Sortable Item Wrapper for Grid/List
const SortableAccountItem = ({ account, index, viewMode }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: account.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="h-full">
      <AccountCard account={account} index={index} viewMode={viewMode} />
    </div>
  );
};

export default function AccountsGrid() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [activeId, setActiveId] = useState(null);
  const x = useMotionValue(0);

  const { accounts, setAccounts } = useAccountsStore();

  console.log('gridddddddddddddddddddddddd', accounts);

  const sortedAccounts = useMemo(() => {
    if (!accounts) return [];

    const typeOrder = [...new Set(accounts.map((acc) => acc.type))].sort((a, b) =>
      a.localeCompare(b),
    );

    return [...accounts].sort((a, b) => {
      return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
    });
  }, [accounts]);

  // Drag and Drop Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  useEffect(() => {
    console.log('accounts.....', accounts);
  }, []);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = accounts.findIndex((acc) => acc.id === active.id);
      const newIndex = accounts.findIndex((acc) => acc.id === over.id);

      const newOrder = arrayMove(accounts, oldIndex, newIndex);
      setAccounts(newOrder);

      let msgPayLoad = '';
      let order = 1;

      newOrder.forEach((acc) => {
        const accountType = acc.accountType || '1';
        const accountId = acc.accountNumber;

        if (msgPayLoad !== '') {
          msgPayLoad += '@@';
        }

        msgPayLoad += `${accountType}##${accountId}##${order}`;
        order++;
      });

      const uniqueTypes = [...new Set(newOrder.map((acc) => acc.accountType || '1'))];
      const msgLoad = uniqueTypes.join('#');

      const payload = {
        msgPayLoad,
        msgLoad,
        roi: generatedRoi,
      };

      console.log('📦 Reorder Payload:', {
        msgPayLoad,
        msgLoad,
        totalAccounts: newOrder.length,
      });

      try {
        const orderRes = await changeAccountOrder(payload);
        const rsOrder = orderRes?.rs || orderRes;

        if (rsOrder.status === 'success') {
          const updateRes = await getUpdatedAccounts();
          const rsUpdate = updateRes?.rs || updateRes;

          if (rsUpdate.status === 'success') {
            const updatedAccounts = Object.keys(rsUpdate)
              .filter((k) => k.startsWith('A') && !isNaN(k.substring(1)))
              .map((k) => {
                const item = rsUpdate[k];
                const type = detectAccountType(item);
                const av_functions = getAvaiableFunctions(item);
                return {
                  id: item.i,
                  accountNumber: item.a,
                  description: item.d,
                  currency: item.c,
                  balance: Number(item.b || 0),
                  availableBalance: Number(item.ab || 0),
                  accountType: item.atype || '1',
                  type,
                  color: detectAccountColor(item),
                  available_functions: av_functions,
                };
              });

            const sortedUpdatedAccounts = newOrder.map(
              (orderedAcc) =>
                updatedAccounts.find((updatedAcc) => updatedAcc.id === orderedAcc.id) || orderedAcc,
            );

            setAccounts(sortedUpdatedAccounts);
            console.log('✅ Accounts reordered and updated successfully');
          } else {
            console.error('❌ Failed to fetch updated accounts:', rsUpdate.msg);
          }
        } else {
          console.error('❌ Failed to save order:', rsOrder.msg);
        }
      } catch (error) {
        console.error('❌ Reorder error:', error);
      }
    }
    setActiveId(null);
  };

  // Mobile Carousel Logic
  const handleCarouselDragEnd = (event, info) => {
    const threshold = 50;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (Math.abs(velocity) > 500 || Math.abs(offset) > threshold) {
      if (offset > threshold || velocity > 500) {
        setDirection(-1);
        if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        } else {
          setCurrentIndex(accounts.length - 1);
        }
      } else if (offset < -threshold || velocity < -500) {
        setDirection(1);
        if (currentIndex < accounts.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setCurrentIndex(0);
        }
      }
    }

    animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 });
  };

  const rotateY = useTransform(x, [-200, 0, 200], [20, 0, -20]);
  const scale = useTransform(x, [-200, 0, 200], [0.9, 1, 0.9]);

  const activeAccount = accounts.find((acc) => acc.id === activeId);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-900">My Accounts</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle Buttons */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('tabs')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'tabs'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </motion.button>
          </div>

          <Link to="/dashboard/accounts">
            <motion.div
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-orange-700 transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-primary/5"
            >
              View All
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Grid View - Desktop with Drag & Drop */}
      {viewMode === 'grid' && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedAccounts.map((acc) => acc.id)}
            strategy={rectSortingStrategy}
          >
            <div className="hidden gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {sortedAccounts.map((account, index) => (
                <SortableAccountItem
                  key={account.id}
                  account={account}
                  index={index}
                  viewMode="grid"
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay adjustScale={true}>
            {activeAccount ? (
              <div style={{ transform: 'scale(1.05)', cursor: 'grabbing' }}>
                <AccountCard account={activeAccount} index={0} viewMode="grid" />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* List View - Desktop with Drag & Drop */}
      {viewMode === 'list' && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedAccounts.map((acc) => acc.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="hidden grid-cols-1 gap-4 sm:grid xl:grid-cols-2">
              {sortedAccounts.map((account, index) => (
                <SortableAccountItem
                  key={account.id}
                  account={account}
                  index={index}
                  viewMode="list"
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay adjustScale={true}>
            {activeAccount ? (
              <div style={{ transform: 'scale(1.05)', cursor: 'grabbing' }}>
                <AccountCard account={activeAccount} index={0} viewMode="list" />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Mobile View - Grid (Carousel) */}
      {viewMode === 'grid' && (
        <div className="sm:hidden">
          <div className="relative h-[170px] md:h-[210px] perspective-1000">
            <div className="absolute inset-0 pointer-events-none">
              {currentIndex + 2 < sortedAccounts.length && (
                <motion.div
                  initial={{ scale: 0.86, y: 16, opacity: 0.3 }}
                  animate={{ scale: 0.86, y: 16, opacity: 0.3 }}
                  className="absolute inset-0 px-2"
                  style={{ filter: 'brightness(0.7)' }}
                >
                  <div className="h-full overflow-hidden shadow-xl rounded-2xl">
                    <AccountCard
                      account={sortedAccounts[currentIndex + 2]}
                      index={currentIndex + 2}
                      viewMode="grid"
                    />
                  </div>
                </motion.div>
              )}

              {currentIndex + 1 < sortedAccounts.length && (
                <motion.div
                  initial={{ scale: 0.93, y: 8, opacity: 0.6 }}
                  animate={{ scale: 0.93, y: 8, opacity: 0.6 }}
                  className="absolute inset-0 px-2"
                  style={{ filter: 'brightness(0.85)' }}
                >
                  <div className="h-full overflow-hidden shadow-xl rounded-2xl">
                    <AccountCard
                      account={sortedAccounts[currentIndex + 1]}
                      index={currentIndex + 1}
                      viewMode="grid"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={handleCarouselDragEnd}
              style={{
                x,
                rotateY,
                scale,
                transformStyle: 'preserve-3d',
              }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <motion.div
                className="h-full overflow-hidden shadow-2xl rounded-2xl"
                whileTap={{ scale: 0.98 }}
              >
                <AccountCard
                  account={sortedAccounts[currentIndex]}
                  index={currentIndex}
                  viewMode="grid"
                />
              </motion.div>
            </motion.div>

            <button
              onClick={() => {
                setDirection(-1);
                setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : sortedAccounts.length - 1);
              }}
              className="absolute left-0 z-10 flex items-center justify-center w-8 h-8 transition-opacity -translate-x-2 -translate-y-1/2 rounded-full shadow-lg opacity-0 top-1/2 bg-white/90 backdrop-blur-sm hover:opacity-100"
            >
              <ChevronRight className="w-4 h-4 text-gray-700 rotate-180" />
            </button>

            <button
              onClick={() => {
                setDirection(1);
                setCurrentIndex(currentIndex < sortedAccounts.length - 1 ? currentIndex + 1 : 0);
              }}
              className="absolute right-0 z-10 flex items-center justify-center w-8 h-8 transition-opacity translate-x-2 -translate-y-1/2 rounded-full shadow-lg opacity-0 top-1/2 bg-white/90 backdrop-blur-sm hover:opacity-100"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          <div className="flex justify-center items-center gap-1.5 mt-6">
            {sortedAccounts.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-6 bg-linear-to-r from-primary/50 to-primary shadow-sm'
                    : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Mobile View - List View */}
      {viewMode === 'list' && (
        <div className="space-y-4 sm:hidden">
          {sortedAccounts.map((account, index) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <AccountCard account={account} index={index} viewMode="list" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Tabs View with Reordering */}
      {viewMode === 'tabs' && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <AccountTab accounts={sortedAccounts} activeId={activeId} />
        </DndContext>
      )}

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
